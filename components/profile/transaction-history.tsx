import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, ShoppingCart, Store } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Transaction {
  id: string
  transaction_type: string
  item_name: string | null
  amount_credits: number
  amount_real_money: number
  description: string | null
  created_at: string
}

interface TransactionHistoryProps {
  transactions: Transaction[]
}

const transactionIcons: Record<string, any> = {
  purchase: ShoppingCart,
  sale: Store,
  reward: ArrowDownRight,
  upgrade: ArrowUpRight,
}

const transactionColors: Record<string, string> = {
  purchase: "text-destructive",
  sale: "text-chart-3",
  reward: "text-chart-3",
  upgrade: "text-chart-4",
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-lg font-bold text-foreground mb-4">Transaction History</h3>

      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const Icon = transactionIcons[transaction.transaction_type] || ShoppingCart
            const colorClass = transactionColors[transaction.transaction_type] || "text-muted-foreground"
            const isIncome = transaction.transaction_type === "sale" || transaction.transaction_type === "reward"

            return (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-lg bg-secondary border border-border ${colorClass}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {transaction.item_name || transaction.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {transaction.transaction_type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${isIncome ? "text-chart-3" : "text-destructive"}`}>
                    {isIncome ? "+" : "-"}
                    {transaction.amount_credits > 0
                      ? `${transaction.amount_credits.toLocaleString()}c`
                      : `$${transaction.amount_real_money.toFixed(2)}`}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
