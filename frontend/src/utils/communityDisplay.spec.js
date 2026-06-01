import { describe, expect, it } from 'vitest';
import {
  canDeleteCommunityItem,
  coverColorClass,
  getInitials,
  roleLabel,
  timeAgo,
} from './communityDisplay';

describe('communityDisplay helpers', () => {
  it('formats initials and role labels', () => {
    expect(getInitials({ first_name: 'Jialao', last_name: 'Liu' })).toBe('JL');
    expect(roleLabel('student')).toBe('Student');
    expect(roleLabel('unknown')).toBe('unknown');
  });

  it('formats relative time', () => {
    const now = new Date('2026-06-02T12:00:00Z').getTime();

    expect(timeAgo('2026-06-02T11:59:45Z', now)).toBe('just now');
    expect(timeAgo('2026-06-02T11:45:00Z', now)).toBe('15m ago');
    expect(timeAgo('2026-06-02T09:00:00Z', now)).toBe('3h ago');
    expect(timeAgo('2026-05-31T12:00:00Z', now)).toBe('2d ago');
  });

  it('checks delete permission and cover classes', () => {
    expect(canDeleteCommunityItem({ user_id: 10 }, { id: 10 }, false)).toBe(true);
    expect(canDeleteCommunityItem({ user_id: 10 }, { id: 11 }, true)).toBe(true);
    expect(canDeleteCommunityItem({ user_id: 10 }, { id: 11 }, false)).toBe(false);
    expect(coverColorClass(7)).toBe('cov-1');
  });
});
