export function getInitials(item = {}) {
  return (item.first_name?.[0] || '') + (item.last_name?.[0] || '');
}

export function timeAgo(dateStr, now = Date.now()) {
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function roleLabel(role) {
  if (role === 'student') return 'Student';
  if (role === 'admin') return 'Admin';
  if (role === 'alumni') return 'Alumni';
  if (role === 'prospective') return 'Prospective';
  return role;
}

export function canDeleteCommunityItem(item, user, isAdmin = false) {
  return user?.id === item.user_id || isAdmin;
}

export function coverColorClass(index) {
  const classes = ['cov-0', 'cov-1', 'cov-2', 'cov-3', 'cov-4', 'cov-5'];
  return classes[index % classes.length];
}
