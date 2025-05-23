"""Add Error table with foreign key to Student

Revision ID: c290f900b0fa
Revises: 304971dfe881
Create Date: 2025-04-20 08:45:02.908769

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c290f900b0fa'
down_revision = '304971dfe881'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('errors',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('student_id', sa.String(length=5), nullable=False),
    sa.Column('error_message', sa.Text(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('errors')
    # ### end Alembic commands ###
