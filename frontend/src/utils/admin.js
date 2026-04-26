const parseCsv = (value) => (
    (value || '')
        .split(',')
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean)
);

const adminUsernames = parseCsv(import.meta.env.VITE_ADMIN_USERS || 'admin');
const adminEmails = parseCsv(import.meta.env.VITE_ADMIN_EMAILS || '');

export const isAdminUser = (user) => {
    if (!user) return false;

    // Check Django is_staff field (from profile API)
    if (user.is_staff) return true;
    if (user.user?.is_staff) return true;

    // Fallback: check username/email against env-configured admin list
    const username = (user.username || user.user?.username || '').toLowerCase();
    const email = (user.email || user.user?.email || '').toLowerCase();

    return adminUsernames.includes(username) || (email && adminEmails.includes(email));
};
