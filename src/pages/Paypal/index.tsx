import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  
};

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: any) => any;
    };
  }
}

const Index: React.FC<Props> = () => {
  const paypal = useRef<HTMLDivElement>(null);
  const navigate = useNavigate()

  useEffect(() => {
    if (window.paypal) {
      const { Buttons } = window.paypal;

      if (Buttons) {
        Buttons({
          createOrder: (data: any, actions: any, err: any) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  description: "cool looking table",
                  amount: {
                    currency_code: "ILS",
                    value: parseInt(localStorage.getItem("payment_amount")||"")||0,
                  },
                },
              ],
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            console.log(order);
            navigate("/setup")
            
          },
          onError: (err: any) => {
            console.log(err);
          },
        }).render(paypal.current!);
      }
    }
  }, []);

  return (
    <div>
      <div ref={paypal}></div>
    </div>
  );
};

export default Index;
