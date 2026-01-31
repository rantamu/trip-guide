// --- Configuration ---
const TRIP_START_DATE = new Date("2026-02-04T00:00:00");
const TRIP_END_DATE = new Date("2026-02-06T23:59:59");

// Itinerary Data (Chronological Order)
const itinerary = [
    // Day 1: 2026-02-04
    { start: "2026-02-04T07:00", end: "2026-02-04T10:00", title: "移動（大分空港へ）", next: "バス移動" },
    { start: "2026-02-04T10:00", end: "2026-02-04T11:30", title: "バス移動 → 別府", next: "みんなでランチ" },
    { start: "2026-02-04T11:30", end: "2026-02-04T13:00", title: "みんなでランチ", next: "チーム別活動" },
    { start: "2026-02-04T13:00", end: "2026-02-04T16:00", title: "チーム別活動（砂風呂/地獄めぐり）", next: "ホテルチェックイン" },
    { start: "2026-02-04T16:00", end: "2026-02-04T16:30", title: "ホテルチェックイン", next: "自由時間" },
    { start: "2026-02-04T16:30", end: "2026-02-04T18:00", title: "自由時間", next: "大宴会" },
    { start: "2026-02-04T18:00", end: "2026-02-04T20:00", title: "大宴会", next: "二次会" },
    { start: "2026-02-04T20:00", end: "2026-02-05T07:30", title: "二次会", next: "朝食" },
    // Removed 23:00 event to match HTML

    // Day 2: 2026-02-05
    { start: "2026-02-05T07:30", end: "2026-02-05T09:00", title: "朝食", next: "ロビー集合" },
    { start: "2026-02-05T09:00", end: "2026-02-05T09:30", title: "ロビー集合", next: "移動（太宰府へ）" },
    { start: "2026-02-05T09:30", end: "2026-02-05T12:00", title: "移動（太宰府へ）", next: "太宰府ランチ" },
    { start: "2026-02-05T12:00", end: "2026-02-05T14:00", title: "太宰府ランチ", next: "自由時間" },
    { start: "2026-02-05T14:00", end: "2026-02-05T18:00", title: "自由時間（レンタカー）", next: "ホテルチェックイン" },
    { start: "2026-02-05T18:00", end: "2026-02-05T19:00", title: "ホテルチェックイン", next: "Dinner" },
    { start: "2026-02-05T19:00", end: "2026-02-05T21:00", title: "Dinner (ぢどり屋)", next: "Party" },
    { start: "2026-02-05T21:00", end: "2026-02-06T09:45", title: "Party & 就寝", next: "ロビー集合" },

    // Day 3: 2026-02-06
    { start: "2026-02-06T09:45", end: "2026-02-06T10:00", title: "ロビー集合＆チェックアウト", next: "自由行動" },
    { start: "2026-02-06T10:00", end: "2026-02-06T12:00", title: "自由行動・お土産", next: "ラスト福岡飯" },
    { start: "2026-02-06T12:00", end: "2026-02-06T14:00", title: "ラスト福岡飯", next: "レンタカー返却" },
    { start: "2026-02-06T14:00", end: "2026-02-06T14:30", title: "レンタカー返却", next: "空港集合" },
    { start: "2026-02-06T14:30", end: "2026-02-06T15:00", title: "空港集合", next: "解散・フライト" },
    { start: "2026-02-06T15:00", end: "2026-02-06T23:59", title: "解散・帰宅", next: "お疲れ様でした！" }
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

    const eventElements = document.querySelectorAll('.event-new');

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
            // User request: Jump to the NEXT event (i + 1)
            targetIndex = i + 1;
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
        const headerOffset = 80; // Still useful to have some reference, but centering logic overrides specific top offset
        const elementRect = targetElement.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        // Center calculation: (Element Top) - (Viewport Height / 2) + (Element Height / 2)
        const offsetPosition = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });

        // Flash effect to highlight
        targetElement.classList.add('highlight-flash');
        setTimeout(() => {
            targetElement.classList.remove('highlight-flash');
        }, 1500);

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
        // Click Event: Just Jump
        navBtn.addEventListener('click', () => {
            jumpToCurrentEvent();
            // Optional: Immediate feedback shake
            navBtn.classList.remove('animate-shake');
            void navBtn.offsetWidth; // Trigger reflow
            navBtn.classList.add('animate-shake');
            setTimeout(() => {
                navBtn.classList.remove('animate-shake');
            }, 400);
        });

        // Auto-Start Animation Loop (after initial entry)
        setTimeout(() => {
            // Remove initial entry class to prevent conflict
            navBtn.classList.remove('initial-anim');

            // Start regular loop
            setInterval(() => {
                navBtn.classList.add('animate-shake');
                setTimeout(() => {
                    navBtn.classList.remove('animate-shake');
                }, 400);
            }, 4000);
        }, 2000); // Wait for bounceIn (1s delay + 1s duration)
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
    // Info Accordion
    const infoToggleBtn = document.getElementById('info-toggle-btn');
    const infoBody = document.getElementById('info-body');

    if (infoToggleBtn && infoBody) {
        infoToggleBtn.addEventListener('click', () => {
            const isOpen = infoBody.classList.contains('open');
            if (isOpen) {
                // Close
                infoBody.classList.remove('open');
                infoBody.style.maxHeight = null;
                infoToggleBtn.innerHTML = '<span class="icon">📂</span> タップして情報をひらく';
            } else {
                // Open
                infoBody.classList.add('open');
                infoBody.style.maxHeight = infoBody.scrollHeight + "px";
                infoToggleBtn.innerHTML = '<span class="icon">📂</span> 情報をとじる';
            }
        });
    }
});
