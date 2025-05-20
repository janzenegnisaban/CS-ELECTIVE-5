import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminStats } from "@/components/admin/admin-stats"
import prisma from "@/server/db/prisma"

export default async function AdminDashboard() {
  // Fetch dashboard stats
  const productCount = await prisma.product.count()
  const userCount = await prisma.user.count()
  const orderCount = await prisma.order.count()

  // Calculate total revenue
  const orders = await prisma.order.findMany()
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AdminStats
            productCount={productCount}
            userCount={userCount}
            orderCount={orderCount}
            totalRevenue={totalRevenue}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">View all orders in the Orders section</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Products</CardTitle>
                <CardDescription>Best selling products</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">View all products in the Products section</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>View detailed sales reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Analytics feature coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
