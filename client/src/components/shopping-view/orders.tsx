// REACT
import { Fragment, useEffect, useState } from "react";

// COMPONENTS
import { Card, CardTitle, CardHeader, CardContent } from "../ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Badge } from "../ui/badge";

// REDUX
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import ShoppingOrderDetailsView from "./order-details";
import {
  getAllOrdersByUser,
  getOrderDetails,
  resetOrderState,
} from "@/store/order-slice";

const ShoppingOrders = () => {
  const [openOrderDetails, setOpenOrderDetails] = useState(false);
  const { user } = useSelector((state: RootState) => state.authStore);
  const { orderList, orderDetails } = useSelector(
    (state: RootState) => state.orderStore
  );

  const dispatch = useDispatch<AppDispatch>();

  const handleFetchOrderDetails = (getId: string) => {
    dispatch(getOrderDetails(getId));
  };

  useEffect(() => {
    dispatch(getAllOrdersByUser(user.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) {
      setOpenOrderDetails(true);
    }
  }, [orderDetails]);

  return (
    <Fragment>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Order History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Order Price</TableHead>
                <TableHead>
                  <span className="sr-only">Details</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderList && orderList.length > 0
                ? orderList.map((orderItem) => (
                    <TableRow key={orderItem._id}>
                      <TableCell>{orderItem._id}</TableCell>
                      <TableCell>
                        {orderItem?.orderDate.split("T")[0]}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Badge
                            className={`py-1 px-3 ${
                              orderItem?.orderStatus === "completed"
                                ? "bg-green-500"
                                : orderItem?.orderStatus === "cancelled"
                                ? "bg-red-600"
                                : "bg-black"
                            }`}
                          >
                            {orderItem?.orderStatus}
                          </Badge>
                          {orderItem?.isDemoOrder && (
                            <Badge
                              variant="secondary"
                              className="bg-yellow-100 text-yellow-800 py-1 px-3"
                            >
                              DEMO
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{orderItem.totalAmount}</TableCell>
                      <TableCell>
                        <Dialog
                          open={openOrderDetails}
                          onOpenChange={() => {
                            setOpenOrderDetails(false);
                            dispatch(resetOrderState());
                          }}
                        >
                          <Button
                            onClick={() =>
                              handleFetchOrderDetails(orderItem?._id)
                            }
                          >
                            View Details
                          </Button>

                          <DialogContent>
                            <DialogTitle>Order Details</DialogTitle>
                            <DialogDescription>
                              Details of order #{orderItem?._id}
                            </DialogDescription>
                            <ShoppingOrderDetailsView
                              orderDetails={orderDetails}
                            />
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Fragment>
  );
};

export default ShoppingOrders;
