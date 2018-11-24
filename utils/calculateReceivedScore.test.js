import {  calculateReceivedScore as calc } from './calculateReceivedScore';

describe('Test CalculateReceivedScore', () => {
  it('should not undefide', () => {
    expect(calc).not.toBeUndefined();
  });
  it('should return 0 when type in interaction is not reaction_added', () => {
    expect(calc("123")).toEqual(0);
    expect(calc(123)).toEqual(0);
    expect(calc({type: "delete"})).toEqual(0);
  });
  describe('test type reaction_added', () => {
    it('return 2 when description is equals +1', () => {
      const interaction = {
        type: 'reaction_added',
	description: '+1'
      };
      const result = calc(interaction);
      expect(result).toEqual(2);
    });
    it('return -1 when description is equals -1', () => {
      const interaction = {
        type: 'reaction_added',
	description: '-1'
      };
      const result = calc(interaction);
      expect(result).toEqual(-1);
    });
    it('return 0.1 when description is equals atena', () => {
      const interaction = {
        type: 'reaction_added',
	description: 'atena'
      };
      const result = calc(interaction);
      expect(result).toEqual(0.1);
    });
  });
  describe('test type reaction_removed', () => {
    it('return -2 when description is equals +1', () => {
      const interaction = {
        type: 'reaction_removed',
	description: '+1'
      };
      const result = calc(interaction);
      expect(result).toEqual(-2);
    });
    it('return 1 when description is equals -1', () => {
      const interaction = {
        type: 'reaction_removed',
	description: '-1'
      };
      const result = calc(interaction);
      expect(result).toEqual(1);
    });
    it('return -0.1 when description is equals atena', () => {
      const interaction = {
        type: 'reaction_removed',
	description: 'atena'
      };
      const result = calc(interaction);
      expect(result).toEqual(-0.1);
    });
  });
  it('return 1 when type is equals thread', () => {
    const interaction = {
      type: 'thread',
    };
    const result = calc(interaction);
    expect(result).toEqual(1);
  });
});

