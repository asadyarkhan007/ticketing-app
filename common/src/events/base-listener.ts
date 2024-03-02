import {
  StringCodec,
  JsMsg,
  AckPolicy,
  JetStreamManager,
  DeliverPolicy,
} from "nats";
import { Subjects } from "./subjects";
import e from "express";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract stream: string;
  abstract subject: T["subject"];
  abstract consumerName: string;
  abstract onMessage(data: T["data"], msg: JsMsg): void;
  public jsm: JetStreamManager;
  protected ackWait = 5000000000; //5 seconds unit nano seconds

  constructor(jsm: JetStreamManager) {
    this.jsm = jsm;
  }

  consumerConfig() {
    return {
      deliver_policy: DeliverPolicy.All,
      ack_policy: AckPolicy.Explicit,
      ack_wait: this.ackWait,
      durable_name: this.consumerName,
    };
  }

  streamConfig() {
    return {
      name: this.stream,
      subjects: [this.stream + ".*"],
    };
  }

  async listen() {
    console.log(
      `Listening start for stream: ${this.stream}, subject: ${this.subject}, consumer: ${this.consumerName}`
    );
    try {
      await this.jsm.consumers.info(this.stream, this.consumerName);
    } catch (err) {
      try {
        const myStream = await this.jsm.streams.info(this.stream);
        if (!myStream) {
          await this.jsm.streams.add(this.streamConfig());
        }
      } catch (err) {
        await this.jsm.streams.add(this.streamConfig());
      }
      await this.jsm.consumers.add(this.stream, this.consumerConfig());
    }

    const jsclient = this.jsm.jetstream();
    const consumer = await jsclient.consumers.get(
      this.stream,
      this.consumerName
    );
    const messages = await consumer.consume();
    (async () => {
      for await (const m of messages) {
        console.log(
          `Message received: ${m.subject} / ${this.consumerName}, sequence: ${m.seq}, message: ${m.data}`
        );

        if (this.subject == m.subject) {
          m.working();
          const parsedData = this.parseMessage(m);
          this.onMessage(parsedData, m);
        } else {
          m.ack();
        }
      }
    })();
  }

  parseMessage(msg: JsMsg) {
    const data = msg.data;
    const sc = StringCodec();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(sc.decode(data));
  }
}
