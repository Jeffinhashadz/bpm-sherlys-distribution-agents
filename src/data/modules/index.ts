import { accountsTally } from './accountsTally'
import { adminDashboard } from './adminDashboard'
import { dailyStockVerification } from './dailyStockVerification'
import { damageManagement } from './damageManagement'
import { orderToDelivery } from './orderToDelivery'
import { stockReceiving } from './stockReceiving'
import type { BlueprintModule } from '../../types/blueprint'

export const modules: BlueprintModule[] = [
  orderToDelivery,
  damageManagement,
  stockReceiving,
  dailyStockVerification,
  adminDashboard,
  accountsTally,
]

export function getModule(slug: string | undefined): BlueprintModule | undefined {
  return modules.find((item) => item.slug === slug)
}
