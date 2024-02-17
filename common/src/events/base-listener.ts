import {
  StringCodec,
  JsMsg,
  AckPolicy,
  JetStreamManager,
  DeliverPolicy,
} from "nats";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract stream: string;
  abstract subject: T["subject"];
  abstract consumerName: string;
  abstract onMessage(data: T["data"], msg: JsMsg): void;
  private jsm: JetStreamManager;
  protected ackWait = 5 * 1000;

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
      subjects: [this.subject],
    };
  }

  async listen() {
    try {
      await this.jsm.consumers.info(this.stream, this.consumerName);
    } catch (err) {
      await this.jsm.streams.add({
        name: this.stream,
        subjects: [this.subject],
      });
      await this.jsm.consumers.add(this.stream, this.consumerConfig());
    }

    await this.jsm.streams.add(this.streamConfig());
    const jsclient = this.jsm.jetstream();
    const consumer = await jsclient.consumers.get(
      this.stream,
      this.consumerName
    );
    const messages = await consumer.consume();
    for await (const m of messages) {
      console.log(
        `Message received: ${this.subject} / ${this.consumerName} sequence: ${m.seq} message: ${m.data}`
      );
      const parsedData = this.parseMessage(m);
      this.onMessage(parsedData, m);
    }
  }

  parseMessage(msg: JsMsg) {
    const data = msg.data;
    const sc = StringCodec();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(sc.decode(data));
  }
}