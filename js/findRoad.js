const roads = [
  "Alice's House-Bob's House", "Alice's House-Cabin",
  "Alice's House-Post Office", "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop", "Marketplace-Farm",
  "Marketplace-Post Office", "Marketplace-Shop",
  "Marketplace-Town Hall", "Shop-Town Hall"
];

/**
 * 将roads数据映射为每个地点可到达的目的地结构{f: [t,t]}
 *
 * @param {Array} roads
 * @returns Map
 */
function buildGraph (roads) {
  const graph = new Map();
  roads.forEach(road => {
    const [from, to] = road.split('-');

    const r = graph.get(from);

    if (r) r.push(to);
    else graph.set(from, [to]);
  });

  return graph;
}

const roadGraph = buildGraph(roads);

/**
 * 村庄的状态
 *
 * @class VillageState
 * @param {String} robotPosition 机器人当前的位置
 * @param {Array} parcels 未送达的包裹集合，每个包裹含有当前位置信息parcelCurrentPosition及目标位置信息parcelDestination
 */
class VillageState {
  constructor (robotPosition, parcels) {
    this.robotPosition = robotPosition;
    this.parcels = parcels;
  }

  move (destination) {
    // 如果当前位置没有到达目的地的道路
    if (!roadGraph[this.robotPosition].includes(destination)) return this;

    const parcels = this.parcels
      // 更新所有包裹状态
      .map(parcel => {
        // 此包裹不在机器人当前的位置
        if (parcel.parcelCurrentPosition !== this.robotPosition) return parcel;
        /**
         * 此包裹在机器人当前位置，那么久更新包裹的状态
         * 将其当前的位置更新为机器人的目标位置，相当于是被机器人拿走
         */
        return { parcelCurrentPosition: destination, parcelDestination: parcel.parcelDestination };
      })
      // 过滤掉已送达的包裹
      .filter(parcel => parcel.parcelDestination !== parcel.parcelCurrentPosition);

    return new VillageState(destination, parcels); // 返回一个新状态
  }
}
