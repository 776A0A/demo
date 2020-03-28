const roads = [
  "Alice's House-Bob's House", "Alice's House-Cabin",
  "Alice's House-Post Office", "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop", "Marketplace-Farm",
  "Marketplace-Post Office", "Marketplace-Shop",
  "Marketplace-Town Hall", "Shop-Town Hall"
];

const mailRoute = [
  "Alice's House", "Cabin", "Alice's House", "Bob's House",
  "Town Hall", "Daria's House", "Ernie's House",
  "Grete's House", "Shop", "Grete's House", "Farm",
  "Marketplace", "Post Office"
];


const roadGraph = buildGraph(roads);

/**
 * 村庄的状态
 *
 * @class VillageState
 * @param {String} robotPosition 机器人当前的位置
 * @param {Array} parcels 未送达的包裹集合
 * 每个包裹含有当前位置信息parcelCurrentPosition及目标位置信息parcelDestination
 */
class VillageState {
  constructor (robotPosition, parcels) {
    this.robotPosition = robotPosition;
    this.parcels = parcels;
  }

  move (destination) {
    if (!roadGraph.get(this.robotPosition).includes(destination)) return this; // 如果当前位置没有到达目的地的道路

    const parcels = this.parcels
      .map(parcel => { // 更新所有包裹状态
        if (parcel.parcelCurrentPosition !== this.robotPosition) return parcel; // 此包裹不在机器人当前的位置
        /**
         * 此包裹在机器人当前位置，那么就更新包裹的状态
         * 将其当前的位置更新为机器人的目标位置，相当于是被机器人拿走
         */
        return {
          parcelCurrentPosition: destination,
          parcelDestination: parcel.parcelDestination
        };
      })
      .filter(parcel => parcel.parcelDestination !== parcel.parcelCurrentPosition); // 过滤掉已送达的包裹
    return new VillageState(destination, parcels); // 返回一个新状态
  }

  static randomParcels (parcelCount = 5) {
    const parcels = [];

    for (let i = 0; i < parcelCount; i++) {
      const parcelDestination = randomPick([...roadGraph.keys()]);

      let parcelCurrentPosition;

      do {
        parcelCurrentPosition = randomPick([...roadGraph.keys()]);
      } while (parcelCurrentPosition === parcelDestination);

      parcels.push({ parcelCurrentPosition, parcelDestination });
    }

    return new VillageState('Post Office', parcels);
  }
}

// 根据机器人当前的位置随机选取目的地
function randomRouteRobot (state) {
  return { destination: randomPick(roadGraph.get(state.robotPosition)) };
}
// 根据规定路线走的机器人
function routeRobot (state, memory) {
  memory.length === 0 && (memory = mailRoute);

  return { destination: memory[0], memory: memory.slice(1) };
}

function globalOrientedRobot ({ robotPosition, parcels }, route) {
  if (route.length === 0) {
    const parcel = parcels[0];

    if (parcel.parcelCurrentPosition !== robotPosition) {
      // 如果包裹不在机器人当前的位置，那么就让机器人定向移动到包裹位置
      route = findRoute(roadGraph, robotPosition, parcel.parcelCurrentPosition);
    } else {
      // 机器人移动到包裹位置后再定向投送包裹
      route = findRoute(roadGraph, robotPosition, parcel.parcelDestination);
    }
  }

  return { destination: route[0], memory: route.slice(1) };
}



function runRobot (state, robot, memory) {
  for (let turn = 0; ; turn++) {
    if (state.parcels.length === 0) {
      // console.log(`Done in ${turn} turns`);
      return turn;
      break;
    }

    const { destination, memory: _memory } = robot(state, memory);

    state = state.move(destination);

    memory = _memory;

    // console.log(`Moved to ${destination}`);
  }
}







let r = 0;
for (let i = 0; i < 1000; i++) {
  r += runRobot(VillageState.randomParcels(), globalOrientedRobot, []);
}

console.log(r / 1000);















/**
 * 搜索从当前位置到目的地的路线
 *
 * @param {Map} graph 映射地图
 * @param {String} from
 * @param {String} to
 * @returns [route]
 */
function findRoute (graph, from, to) {
  const work = [{ at: from, route: [] }]; // 搜索列表，保存从某地到另一地的路线

  for (let i = 0; i < work.length; i++) {
    const { at, route } = work[i];

    for (const place of graph.get(at)) {
      if (place === to) return route.concat(place); // 当前位置可以直达目的地

      // 检测以前有无搜索此地方，如果没有则添加到搜索列表
      if (!work.some(({ at }) => at === place)) {

        // 这里的 route 保存的是从 from 到 at 的路线，当到达目的地时就可以将 route 拼接
        work.push({
          at: place,
          route: route.concat(place)
        });

      }
    }
  }
}

function randomPick (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 将roads数据映射为每个地点可到达的目的地结构{f: [t,t]}
 *
 * @param {Array} roads
 * @returns Map
 */
function buildGraph (roads) {

  const graph = new Map();

  roads.forEach((road, i) => {
    const [from, to] = road.split('-');

    const f = graph.get(from);

    if (f) f.push(to);
    else graph.set(from, [to]);

    const t = graph.get(to);

    if (t) t.push(from);
    else graph.set(to, [from]);
  });

  return graph;
}