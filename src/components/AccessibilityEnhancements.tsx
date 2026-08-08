import { useEffect } from 'react'

const repairAriaStructure = () => {
  const stepNavigation = document.querySelector('.step-navigation')
  if (stepNavigation) stepNavigation.setAttribute('role', 'navigation')

  const table = document.querySelector('.breakdown-table')
  if (!table) return
  table.querySelectorAll('.breakdown-head > *').forEach((element) => element.setAttribute('role', 'columnheader'))
  table.querySelectorAll('.breakdown-row > *').forEach((element) => element.setAttribute('role', 'cell'))
}

export const AccessibilityEnhancements = () => {
  useEffect(() => {
    repairAriaStructure()
    const observer = new MutationObserver(repairAriaStructure)
    observer.observe(document.getElementById('root')!, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])
  return null
}
