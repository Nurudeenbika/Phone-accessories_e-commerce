import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { pool } from "@/lib/jespo/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId } = await req.json();
  if (!productId)
    return NextResponse.json({ error: "productId required" }, { status: 400 });

  await pool.query(
    `INSERT INTO favorites (id, userId, productId) VALUES (UUID(), ?, ?)`,
    [session.user.id, productId]
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId)
    return NextResponse.json({ error: "productId required" }, { status: 400 });

  await pool.query(`DELETE FROM favorites WHERE userId = ? AND productId = ?`, [
    session.user.id,
    productId,
  ]);

  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [rows] = await pool.query(
    `
    SELECT p.*
    FROM favorites f
    JOIN products p ON p.id = f.productId
    WHERE f.userId = ?
    ORDER BY f.createdAt DESC
    `,
    [session.user.id]
  );

  return NextResponse.json({ products: rows });
}
