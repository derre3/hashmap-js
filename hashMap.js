function HashMap() {
  const LOADFACTOR = 0.75;
  let size = 0;
  let bucketSize = 16;
  let bucket = new Array(bucketSize).fill([]); // fill with empty array to make use of the arr.flat()

  const hash = (value) => {
    let hashCode = 0;
    const primeNumber = 31;
    for (let i = 0; i < value.length; i++) {
      hashCode = primeNumber * hashCode + value.charCodeAt(i);
    }
    return hashCode % bucketSize;
  };

  const set = (key, value) => {
    const hashCode = hash(key);
    const node = { key, value, next: null };
    if (bucket[hashCode].length === 0) {
      bucket[hashCode] = {
        head: node,
      };
      size += 1;
    } else {
      let cur = bucket[hashCode].head;
      // if key is already present,
      if (cur.key === key) return (cur.value = value); // overwrite value
      // if key not present,
      while (cur.next) {
        // traverse linked list until empty space is found
        cur = cur.next;
      }
      cur.next = node;
    }
    if (bucket.flat().length / bucketSize >= LOADFACTOR) growBucketSize();
  };

  const growBucketSize = () => {
    const oldBucket = bucket.flat(); // remove empty arrays
    size = 0;
    bucketSize *= 2;
    bucket = new Array(bucketSize).fill([]);
    oldBucket.forEach((node) => {
      let cur = node.head;
      while (cur) {
        set(cur.key, cur.value);
        cur = cur.next;
      }
    });
  };

  const get = (key) => {
    const hashCode = hash(key);
    if (bucket[hashCode].length === 0) return null;
    let cur = bucket[hashCode].head;
    while (cur) {
      // if key is not found: cur = null
      // if key is found: cur = node
      if (cur.key === key) break;
      cur = cur.next;
    }
    return cur;
  };

  const has = (key) => (get(key) ? true : false);

  const remove = (key) => {
    if (!has(key)) return;
    const hashCode = hash(key);
    let prev;
    let cur = bucket[hashCode].head;
    size -= 1;
    if (cur.key === key) {
      if (cur.next === null) return (bucket[hashCode] = []);
      else return (bucket[hashCode].head = cur.next);
    }
    while (cur) {
      prev = cur;
      cur = cur.next;
      if (cur.key === key) {
        prev.next = cur.next;
        break;
      }
    }
  };

  const length = () => size;

  const clear = () => {
    size = 0;
    bucketSize = 16;
    bucket = new Array(bucketSize).fill([]);
  };

  const keys = () => {
    let keysArr = [];
    bucket.flat().forEach((node) => {
      let cur = node.head;
      while (cur) {
        keysArr.push(cur.key);
        cur = cur.next;
      }
    });
    return keysArr;
  };

  const values = () => {
    let valuesArr = [];
    bucket.flat().forEach((node) => {
      let cur = node.head;
      while (cur) {
        valuesArr.push(cur.value);
        cur = cur.next;
      }
    });
    return valuesArr;
  };

  const entries = () => {
    let entriesArr = [];
    bucket.flat().forEach((node) => {
      let cur = node.head;
      while (cur) {
        entriesArr.push([cur.key, cur.value]);
        cur = cur.next;
      }
    });
    return entriesArr;
  };

  return {
    set,
    get,
    has,
    remove,
    length,
    clear,
    keys,
    values,
    entries,
  };
}

const testHash = HashMap();
const a = 'Andre';
const b = 'Co';
const c = 'Sther';
const d = 'Cr';
const w = 'TEST';

testHash.set('a', a);
testHash.set('b', b);
testHash.set('c', c);
testHash.set('d', d);
testHash.set('w', w);
testHash.remove('w');
testHash.set('w', w);

console.log(testHash.length()); // 5
console.log(testHash.keys()); // ['a','b','c','d','w']
console.log(testHash.values()); // ['Andre','Co','Sther','Cr','TEST']
console.log(testHash.entries()); // [['a', 'Andre'], ['b', 'Co'], ['c', 'Sther'], ['d', 'Cr'], ['w', 'TEST']]
console.log(testHash.get('w')); // { key: 'w', value: 'TEST', next: null }
console.log(testHash.has('a')); // true
console.log(testHash.get('z')); // null
console.log(testHash.has('z')); // false
