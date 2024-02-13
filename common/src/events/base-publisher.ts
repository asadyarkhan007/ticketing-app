import { StringCodec, JsMsg, JetStreamManager, PubAck } from "nats";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  abstract stream: string;
  private jsm: JetStreamManager;

  constructor(jsm: JetStreamManager) {
    this.jsm = jsm;
  }

  streamConfig(): any {
    return {
      name: this.stream,
      subjects: [this.subject],
    };
  }

  async publish(data: T["data"]): Promise<PubAck> {
    await this.jsm.streams.add(this.streamConfig());
    const js = this.jsm.jetstream();
    const sc = StringCodec();
    return js.publish(this.subject, JSON.stringify(data));
  }
}
