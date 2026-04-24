"""initial schema"""

from alembic import op
import sqlalchemy as sa

revision = "20260424_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table("users", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("email", sa.String(length=255), nullable=False), sa.Column("hashed_password", sa.String(length=255), nullable=False), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table("entries", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False), sa.Column("text", sa.Text(), nullable=False), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.create_index("ix_entries_user_id", "entries", ["user_id"])
    op.create_index("ix_entries_created_at", "entries", ["created_at"])

    op.create_table("analyses", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("entry_id", sa.Integer(), sa.ForeignKey("entries.id", ondelete="CASCADE"), nullable=False), sa.Column("status", sa.String(length=20), nullable=False, server_default="pending"), sa.Column("summary", sa.String(), nullable=True), sa.Column("classification", sa.String(length=100), nullable=True), sa.Column("sentiment", sa.String(length=20), nullable=True), sa.Column("key_topics", sa.JSON(), nullable=True), sa.Column("action_items", sa.JSON(), nullable=True), sa.Column("confidence", sa.Float(), nullable=True), sa.Column("raw_output", sa.JSON(), nullable=True), sa.Column("error", sa.String(), nullable=True), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False), sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.create_index("ix_analyses_entry_id", "analyses", ["entry_id"])
    op.create_index("ix_analyses_status", "analyses", ["status"])
    op.create_index("ix_analyses_classification", "analyses", ["classification"])
    op.create_index("ix_analyses_sentiment", "analyses", ["sentiment"])


def downgrade() -> None:
    op.drop_table("analyses")
    op.drop_table("entries")
    op.drop_table("users")
