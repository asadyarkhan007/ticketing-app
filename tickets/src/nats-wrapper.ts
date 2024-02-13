import { Events, connect, NatsConnection, JetStreamManager } from "nats";

class NatsWrapper {
  private _client?: NatsConnection;
  private _jsm?: JetStreamManager;

  get jsm() {
    if (!this._jsm) {
      throw new Error("Conn not access NAT JetStreamManager before connecting");
    }

    return this._jsm;
  }

  get client() {
    if (!this._client) {
      throw new Error("Conn not access NAT clients before connecting");
    }

    return this._client;
  }

  async connect(stream: string, url: string) {
    try {
      this._client = await connect({ servers: url });
      this._jsm = await this.client.jetstreamManager();

      console.log(`connected to ${this.client.getServer()}`);
    } catch (err) {
      console.log(`error connecting to ${url}`);
    }

    const nc = await connect();

    (async () => {
      console.info(`connected ${nc.getServer()}`);
      for await (const s of nc.status()) {
        if (s.type === Events.Disconnect) {
          console.log("Connectiong status closing");
        }

        console.info(`${s.type}: ${s.data}`);
      }
    })().then();
  }
}

export const natsWrapper = new NatsWrapper();
