import{f as r}from"../../nitro/nitro.mjs";import{g as s}from"../../_/db.mjs";const t=r(async r=>{const t=s(r);return{links:(await t.prepare("SELECT * FROM links ORDER BY sort_order").all()).results||[]}});export{t as default};
//# sourceMappingURL=index.get3.mjs.map
