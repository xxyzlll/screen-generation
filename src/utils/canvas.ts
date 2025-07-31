import type { Component } from '@/types/component'

/**
 * 计算组件在画布中的位置
 */
export function calculatePosition(event: MouseEvent, canvasElement: HTMLElement) {
  const rect = canvasElement.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}

/**
 * 检查两个矩形是否相交
 */
export function isRectIntersect(
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
): boolean {
  return !(
    rect1.x + rect1.width < rect2.x ||
    rect2.x + rect2.width < rect1.x ||
    rect1.y + rect1.height < rect2.y ||
    rect2.y + rect2.height < rect1.y
  )
}

/**
 * 对齐到网格
 */
export function snapToGrid(value: number, gridSize = 10): number {
  return Math.round(value / gridSize) * gridSize
}

/**
 * 获取组件边界框
 */
export function getComponentBounds(component: Component) {
  return {
    left: component.style.left,
    top: component.style.top,
    right: component.style.left + component.style.width,
    bottom: component.style.top + component.style.height,
    width: component.style.width,
    height: component.style.height
  }
}

/**
 * 检查点是否在矩形内
 */
export function isPointInRect(
  point: { x: number; y: number },
  rect: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  )
}