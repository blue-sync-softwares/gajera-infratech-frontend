import React from "react";
import Link from "next/link";

const Location = () => {
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/contact", text: "Contact" },
  ];
  return (
    <>
      <section className="bg-primary lg:py-24 py-16 px-4">
        <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md">
            <div className="">
                <div className="grid md:grid-cols-6 lg:grid-cols-9 grid-cols-1 gap-7 border-b border-solid border-white border-opacity-50 pb-11">
                    <div className="col-span-3">
                        <h2 className="text-white text-4xl leading-[1.2] font-bold">Ahemdabad Head Office</h2>
                    </div>
                    <div className="col-span-3">
                        <p className="text-xl text-IceBlue font-normal max-w-64 text-white text-opacity-50">Amarjawan Circle, Nikol 382350</p>
                    </div>
                    <div className="col-span-3">
                        <Link href="mailto:headoffice@property.com" className="text-xl text-white font-medium underline">headoffice@gajeragroup.com</Link>
                        <Link href="tel:731-621-5503" className="text-xl text-white text-opacity-80 flex items-center gap-2 hover:text-opacity-100 w-fit"><span className="text-white !text-opacity-40">Call</span>987-678-5555</Link>
                    </div>
                </div>
                <div className="grid md:grid-cols-6 lg:grid-cols-9 grid-cols-1 gap-7 pt-12">
                    <div className="col-span-3">
                        <h2 className="text-white text-4xl leading-[1.2] font-bold">Gandhinagar Office</h2>
                    </div>
                    <div className="col-span-3">
                        <p className="text-xl text-white text-opacity-50 font-normal max-w-64">Sargasan, DAIICT Road 382001</p>
                    </div>
                    <div className="col-span-3">
                        <Link href="mailto:Office@property.com" className="text-xl text-white font-medium underline">supprt@gajeragroup.com</Link>
                        <Link href="tel:731-235-7993" className="text-xl text-white text-opacity-80 text-IceBlue flex items-center gap-2 hover:text-opacity-100 w-fit"><span className="text-white !text-opacity-40">Call</span>798-235-7993</Link>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </>
  );
};

export default Location;
