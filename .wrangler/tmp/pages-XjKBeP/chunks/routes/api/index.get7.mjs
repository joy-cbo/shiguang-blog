import{f as t}from"../../nitro/nitro.mjs";import{g as s}from"../../_/db.mjs";const o=t(async t=>{const o=s(t);return{tags:(await o.prepare("SELECT t.*, COUNT(pt.post_id) as post_count FROM tags t LEFT JOIN post_tags pt ON t.id = pt.tag_id GROUP BY t.id ORDER BY post_count DESC").all()).results||[]}});export{o as default};
//# sourceMappingURL=index.get7.mjs.map
