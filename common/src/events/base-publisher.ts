import { StringCodec, JsMsg, JetStreamManager, PubAck } from "nats";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  abstract stream: string;
  protected jsm: JetStreamManager;

  constructor(jsm: JetStreamManager) {
    this.jsm = jsm;
  }

  streamConfig(): any {
    return {
      name: this.stream,
      subjects: [this.stream + ".*"],
    };
  }

  async publish(data: T["data"]): Promise<PubAck> {
    try {
      const streamExist = await this.jsm.streams.get(this.stream);
      if (!streamExist) {
        await this.jsm.streams.add(this.streamConfig());
      }
    } catch (err) {
      await this.jsm.streams.add(this.streamConfig());
    }
    const js = this.jsm.jetstream();
    //const sc = StringCodec();
    console.log(`Publish data ${this.subject}, body: ${JSON.stringify(data)}`);
    return js.publish(this.subject, JSON.stringify(data));
  }
}
