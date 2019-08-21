// export function result_from_promise<T>(p: Promise<T>): T{
//     let ret: T | null = null;
//     let f = async () => {
//         ret = await p;
//     };
//     f();
//     if (ret == null)
//         throw new Error('invalid state');
//     return ret;
// }
