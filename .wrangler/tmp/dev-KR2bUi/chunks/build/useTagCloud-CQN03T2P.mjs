import{v as t}from"./server.mjs";function useTagCloud(){const a=t.ref([]);return{tags:a,fetchTags:async function(){try{const t=await $fetch("/api/tags");a.value=t.tags||[]}catch{}}}}export{useTagCloud as u};
//# sourceMappingURL=useTagCloud-CQN03T2P.mjs.map
