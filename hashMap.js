function HashMap() {
  const loadFactor = 0.75;
  let size = 0;
  let bucketSize = 16;
  let bucket = new Array(bucketSize);

  const getSize = () => size;
  const getBucket = () => bucket;
  const getBucketSize = () => bucketSize;

  const growBucketSize = () => {
    const oldBucket = bucket;
    size = 0;
    bucketSize = bucketSize * 2;
    bucket = new Array(bucketSize);
    oldBucket.forEach((node) => {
      if (node === undefined) return;
      else {
        let cur = node.head;
        while (cur) {
          set(cur.key, cur.value);
          cur = cur.next;
        }
      }
    });
  };

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
    if (bucket[hashCode] === undefined) {
      bucket[hashCode] = {
        head: node,
      };
      size += 1;
    } else {
      let cur = bucket[hashCode].head;
      if (cur.key === key) return (cur.value = value);
      while (cur.next) {
        cur = cur.next;
      }
      cur.next = node;
    }
    if (getSize() / getBucketSize() >= loadFactor) growBucketSize();
  };

  const get = (key) => {
    const hashCode = hash(key);
    const bucket = getBucket();
    if (!bucket[hashCode]) return null;
    let cur = bucket[hashCode].head;
    while (cur) {
      if (cur.key === key) break;
      cur = cur.next;
    }
    return cur;
  };

  const has = (key) => {
    const hashCode = hash(key);
    const bucket = getBucket();
    if (!bucket[hashCode]) return false;
    let cur = bucket[hashCode].head;
    while (cur) {
      if (cur.key === key) break;
      cur = cur.next;
    }
    return cur ? true : false;
  };

  const remove = (key) => {
    if (!has(key)) return;
    const hashCode = hash(key);
    const bucket = getBucket();
    let prev;
    let cur = bucket[hashCode].head;
    if (cur.key === key) return (bucket[hashCode].head = cur.next);
    while (cur) {
      prev = cur;
      cur = cur.next;
      if (cur.key === key) {
        prev.next = cur.next;
        break;
      }
    }
  };

  return { set, get, has, remove, getBucket };
}
