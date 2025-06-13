const form = document.getElementById('characterForm');
// const ALL_ITEMS_DATA = [...ITEMS_DATA, ...CONSUMABLES_DATA]; // 旧的合并方式，如果 ITEMS_DATA 和 CONSUMABLES_DATA 不再使用，可以移除
const ALL_ITEMS_DATA = [...(LOOT.items || []), ...(LOOT.consumables || [])];
const itemsContainer = document.getElementById('items');
const FixedSkillSlotIds = {
    RACE_1: 'fixed-skill-race-1',
    RACE_2: 'fixed-skill-race-2',
    GROUP_1: 'fixed-skill-group-1',
    JOB_1: 'fixed-skill-job-1'
};
const experiencesContainer = document.getElementById('experiences');
const AllFixedSlotIds = Object.values(FixedSkillSlotIds);
const weaponName1Input = document.getElementById('weaponName1');
const weaponName2Input = document.getElementById('weaponName2');
const armorName1Input = document.getElementById('armorName1'); 

const addExperienceBtn = document.getElementById('addExperienceBtn');
const appearanceUpload = document.getElementById('appearanceUpload');
const appearancePreview = document.getElementById('appearancePreview');
const removeAppearanceBtn = document.getElementById('removeAppearanceBtn');

let appearanceDataUrl = "";
let currentSelectedJobDomains = { domain1: null, domain2: null }; // Store current job's domains
let currentNewbieQuestionIndex = 0;
let newbieUserAnswers = {};

function autoGrowTextarea(event) {
    const textarea = event.target;
    textarea.style.height = '0px';
    textarea.style.height = textarea.scrollHeight + 'px';
}
function addRemoveListener(button) {
    if (button) {
        button.addEventListener('click', function(event) {
            const experienceItem = event.target.closest('.experience-item');
            if (experienceItem) {
                experienceItem.remove();
                return;
            }
            const itemItem = event.target.closest('.item');
            if (itemItem) {
                itemItem.remove();
                return;
            }
            const skillItemRow = event.target.closest('tr.skill-item');
            if (skillItemRow) {
                skillItemRow.remove();
                return;
            }
        });
    }
}

//#region========================= Setting =========================
const raceSelect = document.getElementById('raceSelect');
const mixedRaceSelect = document.getElementById('mixedRaceSelect');
const communitySelect = document.getElementById('communitySelect');
const professionSelect = document.getElementById('professionSelect');
const subclassSelect = document.getElementById('subclassSelect'); // Added subclassSelect
const levelInput = document.getElementById('level');
const levelTierDisplay = document.getElementById('levelTierDisplay');

function calculateTier(level) {
    const lvl = parseInt(level, 10);
    if (isNaN(lvl)) return "T1"; // Default to T1 if level is not a number

    if (lvl <= 1) return "T1"; // Level 1 is T1
    if (lvl >= 2 && lvl <= 4) return "T2"; // Levels 2-4 are T2
    if (lvl >= 5 && lvl <= 7) return "T3"; // Levels 5-7 are T3
    if (lvl >= 8) return "T4"; // Levels 8+ are T4
    return "T1"; // Default for any other case (e.g., level < 1, though <=1 handles it)
}
function updateLevelTierDisplay() {
    if (levelInput && levelTierDisplay) {
        const tierString = calculateTier(levelInput.value);
        levelTierDisplay.textContent = tierString; // calculateTier now returns "T1", "T2", etc.
    }
}
if (levelInput) {
    levelInput.addEventListener('input', updateLevelTierDisplay);
}

//#endregion====================== End of Setting ======================