import Point from '../../src/geometries/Point'

const point1 = new Point(100, 100)

test('point.equals方法', () => {
  expect(point1.equals(100, 100)).toBeTruthy()
  expect(point1.equals(100, 1)).toBeFalsy()
})

test('point.equalsPoint 方法', () => {
  expect(point1.equalsPoint(new Point(100, 100))).toBeTruthy()
  expect(point1.equalsPoint(new Point(100, 1))).toBeFalsy()
})
