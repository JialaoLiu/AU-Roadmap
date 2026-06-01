import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import CourseCard from '../level1/CourseCard.vue';

describe('CourseCard', () => {
  const course = {
    id: 1,
    code: 'COMP5800',
    name: 'Industry Research Project',
    units: 6,
    is_core: true,
    prerequisites: [{ id: 2 }],
  };

  it('renders course summary information', () => {
    const wrapper = mount(CourseCard, { props: { course } });

    expect(wrapper.text()).toContain('COMP5800');
    expect(wrapper.text()).toContain('Industry Research Project');
    expect(wrapper.text()).toContain('Core');
    expect(wrapper.text()).toContain('6 units');
    expect(wrapper.text()).toContain('1 prereq');
  });

  it('emits selected course when clicked', async () => {
    const wrapper = mount(CourseCard, { props: { course } });

    await wrapper.trigger('click');

    expect(wrapper.emitted('select')?.[0]).toEqual([course]);
  });
});
