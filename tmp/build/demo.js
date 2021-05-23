window.D3O_RewardBoard((async({Board:e,fetch:t,Template:o})=>{const r=await t("/rewards",{method:"GET"});if(null===r)throw new Error("rewards fetch failed");const a=await t("/player",{method:"GET"});if(null===a)throw new Error("defaultPlayerData fetch failed");function s(e){const t=document.querySelector("#rewards-tp-badge");e?t.classList.remove("invisible"):t.classList.add("invisible")}const i=e.findButtons((e=>document.getElementById(`rewards-btn-${e}`))),d=new e({element:document.querySelector("#rewards-board"),defaultPosition:a.position,avatarColor:"#23a85a",rewards:r,onStepRequested:async function(e){i.disableAll();const o=d.rewardOnPositionGet(e),r=await t("/move",{data:{position:e.toCoords(),reward_id:o?.id}});if(null!==r&&r.valid){if(d.setPosition(e),o){const e=await t("/rewards",{method:"GET"});if(null===e)throw new Error("rewards fetch failed");d.setRewards(e)}r.moves>0&&i.update(d),document.querySelector("#rewards-moves-left").textContent=r.moves,s(r.teleport_active)}},onPositionClick:function(e){const t=d.rewardOnPositionGet(e);if(t){const e=document.querySelector("#rewards-modal"),r=new o(e.querySelector("template"));r.set("text",t.text),r.set("badge",t.label,(e=>e.style.backgroundColor=t.color)),r.insertInto(e.querySelector(".modal-body")),$(e).modal({show:!0});let a=document.querySelector("#rewards-list > .active");a&&a.classList.remove("active")}},onMouseOverPosition:function(e){let t=document.querySelector("#rewards-list > .active");t&&t.classList.remove("active");const o=e&&d.rewardOnPositionGet(e);o&&(t=document.querySelector(`#rewards-list > [data-reward-id="${o.id}"]`),t&&t.classList.add("active"))}});i.onClick=e=>d.step(e),a.moves>0&&i.update(d),s(a.teleport_active),window.D3O_REWARDS_BOARD=d}));