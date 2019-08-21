var Application = require('./Application');

async function main(){
    
    await Application.create_wallet('test1', 'BTC');
    var w = await Application.create_wallet('test2', 'BTC');
    console.log(await Application.get_wallets());
    console.log(w.get_balance());
}

async function test(){
    //console.log(new Application.Application().get_address());
    var x = await new Application.Application({
        secure_get: (x, y) => { return new Promise((a, b) => { a(null); }); },
        secure_set: (x) => { return new Promise((a, b) => { a(); }); }
    });
    var result = await x.test('sand scene goddess year era demand notice chapter diet denial example this alarm error blossom');
    
    for (var i = 0; i < result.length; i++)
        console.log(result[i]);
}

function test2(){
    var f = async () => {
        console.log(1);
        var val = await new Promise((a, b) => {
            console.log(2);
            a();
        }).then(() => {
            console.log(3);
        }).catch(error => { throw error; });
        console.log(4);
        throw new Error('hello');
    };
    f();
}

//main();
test();
//test2();
