declare module 'socket.io-client' {
  import { ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
  export declare function io(uri: string, opts?: Partial<ManagerOptions & SocketOptions>): Socket;
  export default io;
}
