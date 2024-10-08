function sum(a: number, b: number): number {
    return a + b;
}

it('should sum 1 + 2 and return 3', () => {
    expect(sum(1, 2)).toBe(3);
});