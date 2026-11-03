"""
Scan2SQL — Normalized SQLAlchemy ORM Models for PostgreSQL
Tables:
1. documents  : Stores uploaded document metadata and OCR-extracted text.
2. bills      : Stores structured header/summary fields for shop bills (1-to-1 / many-to-1 with documents).
3. bill_items : Stores individual line items belonging to a bill (many-to-1 with bills).
"""
from datetime import datetime, date
from decimal import Decimal
from typing import List, Optional

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Date,
    DateTime,
    Numeric,
    ForeignKey,
    func,
)
from sqlalchemy.orm import relationship, Mapped, mapped_column

from backend.database import Base


class Document(Base):
    """
    Stores uploaded document metadata and raw/edited OCR text.
    Supports both Normal Documents ('normal_document') and Shop Bills ('shop_bill').
    """

    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    filename: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    file_type: Mapped[str] = mapped_column(String(20), nullable=False)  # jpg, jpeg, png, pdf
    document_type: Mapped[str] = mapped_column(
        String(50), nullable=False, default="normal_document", index=True
    )  # 'normal_document' | 'shop_bill'
    extracted_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    # Relationship to Bill (cascade delete when parent Document is deleted)
    bills: Mapped[List["Bill"]] = relationship(
        "Bill",
        back_populates="document",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    def __repr__(self) -> str:
        return (
            f"<Document(id={self.id}, filename='{self.filename}', "
            f"document_type='{self.document_type}')>"
        )


class Bill(Base):
    """
    Stores structured shop receipt / invoice header and financial totals.
    Linked to a source Document record via document_id foreign key.
    """

    __tablename__ = "bills"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    document_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    shop_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)
    invoice_number: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    bill_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True, index=True)
    subtotal: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 2), nullable=True)
    tax_amount: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 2), nullable=True)
    grand_total: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 2), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    # Relationships
    document: Mapped["Document"] = relationship("Document", back_populates="bills")
    items: Mapped[List["BillItem"]] = relationship(
        "BillItem",
        back_populates="bill",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by="BillItem.id",
    )

    def __repr__(self) -> str:
        return (
            f"<Bill(id={self.id}, shop_name='{self.shop_name}', "
            f"invoice_number='{self.invoice_number}', grand_total={self.grand_total})>"
        )


class BillItem(Base):
    """
    Stores individual line items extracted from a shop bill.
    Linked to a parent Bill record via bill_id foreign key.
    """

    __tablename__ = "bill_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    bill_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("bills.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    item_name: Mapped[str] = mapped_column(String(255), nullable=False)
    quantity: Mapped[Decimal] = mapped_column(
        Numeric(10, 3), nullable=False, default=Decimal("1.000")
    )
    unit_price: Mapped[Decimal] = mapped_column(
        Numeric(12, 2), nullable=False, default=Decimal("0.00")
    )
    total_price: Mapped[Decimal] = mapped_column(
        Numeric(12, 2), nullable=False, default=Decimal("0.00")
    )

    # Relationship back to parent Bill
    bill: Mapped["Bill"] = relationship("Bill", back_populates="items")

    def __repr__(self) -> str:
        return (
            f"<BillItem(id={self.id}, bill_id={self.bill_id}, "
            f"item_name='{self.item_name}', total_price={self.total_price})>"
        )
