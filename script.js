// --- Configuration ---
const TRIP_START_DATE = new Date("2026-02-04T00:00:00");
const TRIP_END_DATE = new Date("2026-02-06T23:59:59");

// Itinerary Data (Chronological Order)
const itinerary = [
    // Day 0: Test Day (2025-12-25)
    { start: "2025-12-25T09:00", end: "2025-12-25T10:00", title: "OZU出勤", next: "社員旅行MTG" },
    { start: "2025-12-25T10:00", end: "2025-12-25T11:00", title: "社員旅行MTG", next: "お腹空いてくる" },
    { start: "2025-12-25T11:00", end: "2025-12-25T12:00", title: "お腹空いてくる", next: "Day1へ" },

    // Day 1: 2026-02-04
    { start: "2026-02-04T07:00", end: "2026-02-04T10:00", title: "移動（大分空港へ）", next: "バス移動" },
    { start: "2026-02-04T10:00", end: "2026-02-04T11:30", title: "バス移動 → 別府", next: "全体ランチ" },
    { start: "2026-02-04T11:30", end: "2026-02-04T13:00", title: "全体ランチ", next: "地獄めぐり" },
    { start: "2026-02-04T13:00", end: "2026-02-04T15:00", title: "地獄めぐり/砂風呂", next: "ホテルチェックイン" },
    { start: "2026-02-04T15:00", end: "2026-02-04T16:30", title: "ホテルチェックイン", next: "自由時間" },
    { start: "2026-02-04T16:30", end: "2026-02-04T18:00", title: "自由時間（宴会準備）", next: "大宴会（一次会）" },
    { start: "2026-02-04T18:00", end: "2026-02-04T20:00", title: "大宴会（一次会）", next: "ビンゴ大会" },
    { start: "2026-02-04T20:00", end: "2026-02-04T23:00", title: "ビンゴ大会（二次会）", next: "三次会or就寝" },
    { start: "2026-02-04T23:00", end: "2026-02-05T07:00", title: "三次会 / 就寝", next: "朝食・出発" },

    // Day 2: 2026-02-05
    { start: "2026-02-05T07:00", end: "2026-02-05T09:30", title: "朝の自由時間", next: "チェックアウト" },
    { start: "2026-02-05T09:30", end: "2026-02-05T10:00", title: "チェックアウト", next: "バス移動" },
    { start: "2026-02-05T10:00", end: "2026-02-05T11:30", title: "バス移動（太宰府へ）", next: "太宰府ランチ" },
    { start: "2026-02-05T11:30", end: "2026-02-05T14:00", title: "太宰府ランチ&散策", next: "博多へ移動・自由時間" },
    { start: "2026-02-05T14:00", end: "2026-02-05T18:00", title: "自由時間（チーム行動）", next: "ホテルチェックイン - 博多" },
    { start: "2026-02-05T18:00", end: "2026-02-05T19:00", title: "ホテルチェックイン", next: "夕食（モツ鍋等）" },
    { start: "2026-02-05T19:00", end: "2026-02-05T21:00", title: "夕食（チームごと）", next: "全体飲み会" },
    { start: "2026-02-05T21:00", end: "2026-02-05T23:00", title: "全体飲み会（スナック）", next: "バーはしご酒" },
    { start: "2026-02-05T23:00", end: "2026-02-06T09:00", title: "はしご酒 / 就寝", next: "Day3 自由行動" },

    // Day 3: 2026-02-06
    { start: "2026-02-06T09:00", end: "2026-02-06T10:00", title: "Day3 自由行動開始", next: "チェックアウト" },
    { start: "2026-02-06T10:00", end: "2026-02-06T16:00", title: "チェックアウト・自由観光", next: "帰宅の途へ" },
    { start: "2026-02-06T16:00", end: "2026-02-06T23:59", title: "解散・帰宅", next: "お疲れ様でした！" }
];

// --- "Next Where?" Jump Button Logic ---
function jumpToCurrentEvent() {
    const now = new Date();
    // const now = new Date("2025-02-04T12:00:00"); // Debug

    let targetEvent = null;
    let minTimeDiff = Infinity;

    // Find the current or next event
    // Since we don't have unique IDs on every li, we might need to add them or find them by data attributes.
    // The previous HTML didn't strictly have IDs on every li, so let's rely on finding standard elements by time context.
    // Actually, simpler: iterate through our 'itinerary' data, find the index, then find the corresponding list item.
    // We need to match the itinerary items to the DOM elements. 
    // Let's assume the order in 'itinerary' matches the order of '.event' classes in the DOM.

    const eventElements = document.querySelectorAll('.event');

    // Safety check
    if (itinerary.length !== eventElements.length) {
        console.warn("Itinerary data length mismatch with DOM elements. Itinerary: " + itinerary.length + ", DOM: " + eventElements.length);
    }

    let targetIndex = -1;

    for (let i = 0; i < itinerary.length; i++) {
        const start = new Date(itinerary[i].start);
        const end = new Date(itinerary[i].end);

        if (now >= start && now < end) {
            // Found current active event
            targetIndex = i;
            break;
        }

        // If not found current, track the closest future event
        if (now < start) {
            targetIndex = i; // The first future event
            break;
        }
    }

    // Scroll to it
    if (targetIndex !== -1 && eventElements[targetIndex]) {
        const targetElement = eventElements[targetIndex];
        const headerOffset = 80; // Sticky nav height + padding
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });

        // Flash effect to highlight
        targetElement.style.transition = "background 0.5s";
        let originalBg = targetElement.style.background;
        targetElement.style.background = "#fff9c4"; // Yellow highlight
        setTimeout(() => {
            targetElement.style.background = originalBg;
        }, 1000);

    } else {
        alert("現在の予定が見つかりませんでした（ツアー終了か開始前です）");
    }
}

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {

    // Jump Button Event
    const navBtn = document.getElementById('next-where-btn');
    let jumpInterval = null;

    if (navBtn) {
        navBtn.addEventListener('click', () => {
            // Execute immediately on click
            jumpToCurrentEvent();

            // Clear any existing interval to prevent duplicates
            if (jumpInterval) clearInterval(jumpInterval);

            // Start repeating animation every 4 seconds
            jumpInterval = setInterval(() => {
                navBtn.classList.add('animate-shake');
                // Remove class after animation completes to allow re-triggering
                setTimeout(() => {
                    navBtn.classList.remove('animate-shake');
                }, 400); // Match animation duration
            }, 4000);
        });
    }

    // Smooth Scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 60;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });
});
