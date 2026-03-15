export interface Track {
  codec: string;
  type: string;
}

export interface Reader {
  id: string;
  created: string;
  remoteAddr: string;
}

export interface StreamStatus {
  name: string;
  ready: boolean;
  online: boolean;
  tracks: Track[];
  readers: Reader[];
}
