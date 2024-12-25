import { getPaymentInfo } from "@/actions/user"

type Props={
    
}

export default async function BillingPage(props:Props){
    //get payment info of the costumer
    const payment=await getPaymentInfo();

    return (
         <div className="bg-[#1D1D1D] flex flex-col gap-y-8 p-5 rounded-xl">
      <div>
        <h2 className="text-2xl">Current Plan</h2>
        <p className="text-[#9D9D9D]">Your Payment Histroy</p>
      </div>
      <div>
        <h2 className="text-2xl">
          ${payment?.data?.subscription?.plan === 'PRO' ? '99' : '0'}/Month
        </h2>
        <p className="text-[#9D9D9D]">{payment?.data?.subscription?.plan}</p>
      </div>
    </div>
    )
}