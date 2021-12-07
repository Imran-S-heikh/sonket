import Store from '../src/index';

test('State Update 10 to 20',()=>{
    const store = new Store(10);
    expect(store.getState()).toBe(10);
    store.dispatch('token',()=>20);
    expect(store.getState()).toBe(20);
});

test('Subscribe Callback',()=>{
    const store = new Store(10);
    let isCalled = 0;
    
    store.subscribe('test1',()=>{
        isCalled += 1;
    });

    store.subscribe('test1',()=>{
        isCalled += 1;
    },false);

    store.subscribe('test1',()=>{
        isCalled += 1;
    });

    store.dispatch('test1',()=>30)

    expect(isCalled).toBe(5);
});

test('Group Subscribe Callback',()=>{
    const store = new Store(10);
    let isCalled = false;
    let called = 0;
    
    store.subscribe(['test1'],()=>{
        isCalled = true
    });

    store.subscribe(['test2','test3','test4','test5'],()=>{
        called += 1;
    });

    store.subscribe(['test4','test5'],()=>{
        called += 1;
    },false);

    store.dispatch('test1',()=>30)
    store.dispatch('test2',()=>30)
    store.dispatch('test3',()=>30)
    store.dispatch('test4',()=>30)
    store.dispatch('test5',()=>30)

    expect(isCalled).toBe(true);
    expect(called).toBe(7);
});

test('Unsubscribe',()=>{
    const store = new Store(10);
    let isCalled = false;
    
    const unsubscribe = store.subscribe('test1',()=>{
        isCalled = true;
    },false);

    const groupUnsubscribe = store.subscribe(['test1','test2'],()=>{
        isCalled = true;
    },false);

    store.subscribe('test1',()=>{
        // isCalled = true;
    },false);

    unsubscribe();
    groupUnsubscribe();

    store.dispatch('test1',()=>30)

    expect(isCalled).toBe(false);
    expect(store['subscribers']['test1'][0]).toBe(null);
    expect(store['subscribers']['test1'][1]).toBe(null);
    expect(typeof store['subscribers']['test1'][2]).toBe('function');
    expect(store['subscribers']['test2'][0]).toBe(null);
});