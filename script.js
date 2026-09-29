
"use strict";

const elements = {
    hours: document.querySelector("#hours"),
    minutes: document.querySelector("#minutes"),
    seconds: document.querySelector("#seconds"),
    period: document.querySelector("#period"),
    weekday: document.querySelector("#weekday"),
    fullDate: document.querySelector("#full-date"),
    shortDate: document.querySelector("#short-date"),
    timezone: document.querySelector("#timezone"),
    format12: document.querySelector("#format12"),
    format24: document.querySelector("#format24"),
    timeDisplay: document.querySelector(".time-display")
};

const state = {
    use24HourFormat: false
};

const dateFormatters = {
    weekday: new Intl.DateTimeFormat("en-US", {
        weekday: "long"
    }),

    fullDate: new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric"
    }),

    shortDate: new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    }),

    timezone: new Intl.DateTimeFormat("en-US", {
        timeZoneName: "short"
    })
};

function padNumber(number) {
    return String(number).padStart(2, "0");
}

function updateDate(date) {
    elements.weekday.textContent =
        dateFormatters.weekday.format(date).toUpperCase();

    elements.fullDate.textContent =
        dateFormatters.fullDate
            .format(date)
            .toUpperCase();

    elements.shortDate.textContent =
        dateFormatters.shortDate.format(date).replaceAll("/", " / ");

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    elements.timezone.textContent =
        `${timezone} · ${dateFormatters.timezone
            .formatToParts(date)
            .find(part => part.type === "timeZoneName")?.value ?? ""}`;
}

function updateTime(date) {
    const hours24 = date.getHours();

    const hours = state.use24HourFormat
        ? hours24
        : hours24 % 12 || 12;

    elements.hours.textContent = padNumber(hours);
    elements.minutes.textContent = padNumber(date.getMinutes());
    elements.seconds.textContent = padNumber(date.getSeconds());

    elements.period.textContent = hours24 >= 12 ? "PM" : "AM";
    elements.period.hidden = state.use24HourFormat;

    elements.timeDisplay.setAttribute(
        "aria-label",
        `Current local time: ${new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: !state.use24HourFormat
        }).format(date)}`
    );
}

function updateClock() {
    const now = new Date();

    updateTime(now);
    updateDate(now);
}

function setTimeFormat(use24HourFormat) {
    state.use24HourFormat = use24HourFormat;

    elements.format12.classList.toggle(
        "is-active",
        !use24HourFormat
    );

    elements.format24.classList.toggle(
        "is-active",
        use24HourFormat
    );

    elements.format12.setAttribute(
        "aria-pressed",
        String(!use24HourFormat)
    );

    elements.format24.setAttribute(
        "aria-pressed",
        String(use24HourFormat)
    );

    updateClock();
}

elements.format12.addEventListener("click", () => {
    setTimeFormat(false);
});

elements.format24.addEventListener("click", () => {
    setTimeFormat(true);
});

updateClock();
setInterval(updateClock, 1000);