const arr = [3, 2, 5, 1, 5, 20, 1, 100, -1, -50, 6, 32, 24, -1000, -0, +0, 23,];

console.log(quickSort2(arr));

// in-place 使用原地排序，不需要额外的空间来存储每一项（也就是不创建数组来存储）
function quickSort2 (arr) {

    // 交换函数
    function swap (arr, a, b) {
        if (a === b) return;
        [arr[a], arr[b]] = [arr[b], arr[a]];
    }

    // 
    function partition (arr, left, right) {
        const pivot = arr[left]; // 取到基准
        let storeIndex = left; // 最后会和基准交换的index值
        for (let i = left + 1; i <= right; i++) { 
            /**
             * 连续大于基准的项，当遇到小于基准的项时，会将小于基准的项和最前面的
             * 大于基准的项互换位置，而storeIndex也会加1
             */
            if (arr[i] < pivot) swap(arr, ++storeIndex, i);
        }

        swap(arr, left, storeIndex); // 和基准交换位置
        return storeIndex;
    }

    // 递归
    function sort (arr, left, right) {
        if (left < right) {
            const storeIndex = partition(arr, left, right); // storeIndex是已经摆放正确位置的元素索引

            // 以此来分区，继续交换
            sort(arr, left, storeIndex - 1)
            sort(arr, storeIndex + 1, right)
        }
    }

    sort(arr, 0, arr.length - 1)

    return arr
}





function quickSort1 (arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const midItem = arr.splice(mid, 1)[0];
    const left = [];
    const right = [];

    for (let i = 0, item; item = arr[i++];) {
        if (item < midItem) left.push(item);
        else right.push(item);
    }

    return quickSort(left).concat(midItem, quickSort(right));
}
