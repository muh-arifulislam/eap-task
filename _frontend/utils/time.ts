// Bangla time units
const timeUnitsBn = {
  second: "সেকেন্ড",
  minute: "মিনিট",
  hour: "ঘণ্টা",
  day: "দিন",
  month: "মাস",
  year: "বছর",
};

/**
 * Converts an English number to Bangla digits
 */
function toBanglaNumber(num: number) {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return num
    .toString()
    .split("")
    .map((d) => (/\d/.test(d) ? bnDigits[Number(d)] : d))
    .join("");
}

/**
 * Unified timeAgo function
 */
export function timeAgo(dateString: string | Date, lang = "bn") {
  const now = new Date();
  const date = new Date(dateString);
  const diff = now.getTime() - date.getTime(); // milliseconds

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (lang === "bn") {
    if (seconds < 60)
      return `${toBanglaNumber(seconds)} ${timeUnitsBn.second} আগে`;
    if (minutes < 60)
      return `${toBanglaNumber(minutes)} ${timeUnitsBn.minute} আগে`;
    if (hours < 24) return `${toBanglaNumber(hours)} ${timeUnitsBn.hour} আগে`;
    if (days < 30) return `${toBanglaNumber(days)} ${timeUnitsBn.day} আগে`;
    if (months < 12)
      return `${toBanglaNumber(months)} ${timeUnitsBn.month} আগে`;
    return `${toBanglaNumber(years)} ${timeUnitsBn.year} আগে`;
  } else {
    if (seconds < 60) return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
}

export function formatTimestamp(
  timestamp: number | string | Date,
  lang: "en" | "bn"
) {
  const date = new Date(timestamp);

  if (lang === "en") {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // convert 0 → 12, 13 → 1, etc.
    const hoursStr = hours.toString().padStart(2, "0");

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    return `${hoursStr}:${minutes} ${ampm}, ${day} ${month} ${year}`;
  } else {
    // Bengali formatting
    const bengaliNumbers = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
    
    const convertToBengali = (num: number) =>
      num.toString().split("").map(d => bengaliNumbers[parseInt(d)]).join("");

    let hours = date.getHours();
    const minutes = convertToBengali(date.getMinutes());
    const ampm = hours >= 12 ? "অপরাহ্ন" : "পূর্বাহ্ন";

    hours = hours % 12 || 12;
    const hoursBN = convertToBengali(hours);

    const day = convertToBengali(date.getDate());
    const monthsBN = [
      "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
      "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
    ];
    const month = monthsBN[date.getMonth()];
    const year = convertToBengali(date.getFullYear());

    return `${hoursBN} টা ${minutes} মিনিট, ${ampm}, ${day} ${month} ${year}`;
  }
}

export function formatTimestampMagazine(timestamp: number | string | Date, lang: "en" | "bn") {
  const date = new Date(timestamp);

  if (lang === "en") {
    // English formatting
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  } else {
    // Bengali formatting
    const bengaliNumbers = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
    
    const convertToBengali = (num: number) => {
      return num.toString().split("").map(d => bengaliNumbers[parseInt(d)]).join("");
    };

    const hours = convertToBengali(date.getHours());
    const minutes = convertToBengali(date.getMinutes());
    const day = convertToBengali(date.getDate());

    const monthsBN = [
      "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
      "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
    ];
    const month = monthsBN[date.getMonth()];
    const year = convertToBengali(date.getFullYear());

    return `${day} ${month} ${year}`;
  }
}