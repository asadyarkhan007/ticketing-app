import { Subjects } from "@asticketservice/common";
import { PubAck, JetStreamPublishOptions, Payload } from "nats";
export const natsWrapper = {
  jsm: {
    streams: {
      get(stream: string): Promise<void> {
        return new Promise<void>((resolve) => {
          resolve();
        });
      },
      add(obj: any): Promise<void> {
        return new Promise<void>((resolve) => {
          resolve();
        });
      },
    },
    jetstream(): any {
      return {
        publish: jest
          .fn()
          .mockImplementation(
            (
              subj: Subjects,
              payload?: Payload,
              options?: Partial<JetStreamPublishOptions>
            ): Promise<PubAck> => {
              console.log("Publishing subject:", subj);
              console.log("Publishing data:", payload);
              return Promise.resolve({} as PubAck);
            }
          ),
      };
    },
  },
  client: {
    jetstreamManager(jsm: any): Promise<any> {
      return new Promise<any>((resolve) => {
        resolve(jsm);
      });
    },
    getServer(): string {
      return "";
    },
    status(): any {
      return {
        type: "test",
      };
    },
  },
  connect(obj: any): Promise<any> {
    return new Promise<any>((resolve) => {
      resolve(this.client);
    });
  },
};
