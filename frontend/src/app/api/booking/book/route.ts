import { NextRequest, NextResponse } from "next/server";
import { liteapi } from "@/lib/liteapi";

export async function POST(req: NextRequest) {
  try {
    const { prebookId, transactionId, holder, guests, hotelName, checkin, checkout, price, currency } = await req.json();

    if (!prebookId || !transactionId || !holder?.firstName || !holder?.lastName || !holder?.email) {
      return NextResponse.json(
        { error: "prebookId, transactionId and holder {firstName,lastName,email} are required" },
        { status: 400 }
      );
    }

    if (prebookId.startsWith("mock-")) {
      return NextResponse.json({
        bookingId: "B-" + Math.floor(Math.random() * 1000000),
        status: "CONFIRMED",
        hotelConfirmationCode: "HC-" + Math.floor(Math.random() * 1000000),
        hotel: hotelName || "The Lemon Grass Hotel",
        checkin: checkin || null,
        checkout: checkout || null,
        price: price ? Math.round(price) : null,
        currency: currency || null,
      });
    }

    const out = await liteapi("/rates/book", {
      method: "POST",
      body: {
        prebookId,
        holder,
        payment: { method: "TRANSACTION_ID", transactionId },
        guests:
          guests && guests.length
            ? guests
            : [{ occupancyNumber: 1, firstName: holder.firstName, lastName: holder.lastName }],
      },
    });

    const d = out?.data || {};
    return NextResponse.json({
      bookingId: d.bookingId,
      status: d.status,
      hotelConfirmationCode: d.hotelConfirmationCode || null,
      hotel: d.hotel?.name || null,
      checkin: d.checkin || null,
      checkout: d.checkout || null,
      price: d.price ?? null,
      currency: d.currency || null,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
