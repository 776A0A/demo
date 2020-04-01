export default function initLiftCircle (vm) {
  const { mounted } = vm.$options;
  mounted && mounted.call(vm);
}