window.D3O_RewardBoard((async({Board:e,fetch:t,Template:o})=>{const r="http://localhost:3000",a=await t(r+"/rewards",{method:"GET"});if(null===a)throw new Error("rewards fetch failed");const n=await t(r+"/player",{method:"GET"});if(null===n)throw new Error("defaultPlayerData fetch failed");const d=e.findButtons((e=>document.getElementById(`rewards-btn-${e}`))),s=new e({element:document.querySelector("#rewards-board"),defaultPosition:n.position,rewards:a,onStepRequested:async function(e){d.disableAll();const o=await t(r+"/move",{data:e});null!==o&&o.valid&&(s.setPosition(e),o.moves>0&&d.update(s),document.querySelector("#rewards-moves-left").textContent=o.moves)},onPositionClick:function(e){const t=s.rewardOnPositionGet(e);if(t){const e=document.querySelector("#rewards-modal"),r=new o(e.querySelector("template"));r.set("text",t.text),r.insertInto(e.querySelector(".modal-body")),$(e).modal({show:!0})}},onMouseOverPosition:function(e){let t=document.querySelector("#rewards-list > .active");t&&t.classList.remove("active");const o=e&&s.rewardOnPositionGet(e);o&&(t=document.querySelector(`#rewards-list > [data-reward-id="${o.reward_id}"]`),t&&t.classList.add("active"))}});d.onClick=e=>s.step(e),n.moves>0&&d.update(s),window.D3O_REWARDS_BOARD=s}));