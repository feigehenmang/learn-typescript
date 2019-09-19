type ArrayMapCB = (item: any, index: number, currentItem: any[]) => any;
class MyArray extends Array {
    public constructor (...args: number[]) {
        super(...args);
    }
    public map(callbackFn: ArrayMapCB, anthoerArg?: any[]) {
        console.log(callbackFn, anthoerArg);
        let result = anthoerArg ? super.map(callbackFn, anthoerArg) : super.map(callbackFn, anthoerArg);
        console.log(result);
        return result;
    }
}

let myArray = new MyArray(1, 2, 3, 4);
myArray.map((item, index, items) => {
    console.log(item, index, items);
    return item;
});

// console.log(myArray);
