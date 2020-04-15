const insertSort = (arr, from = 0, to = arr.length) => {
    for (let i = from + 1; i < to; i++) {
        const currItem = arr[i];
        for (let j = i - 1; j >= from; j--) {
            const prevItem = arr[j];
            if (currItem < prevItem) {
                /**
                 * 这个j+1其实就是最外层的currItem
                 * 实际比较的也一直都是currItem，如果currItem一直比前面的小
                 * 就一直换下去
                 */
                [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]]
            } else {
                break;
            }
        }
    }
    return arr;
}

const arr = [3, 2, 5, 1, 5, 20, 1, 100, -1, -50, 6, 32, 24, -1000, -0, +0, 23,];

console.log(insertSort(arr));