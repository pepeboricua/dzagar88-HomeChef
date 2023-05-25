"""empty message

Revision ID: 3c2d19cdf9df
Revises: 674a2d305c15
Create Date: 2023-05-25 00:19:31.730057

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3c2d19cdf9df'
down_revision = '674a2d305c15'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('username', sa.String(length=120), nullable=False))
        batch_op.drop_constraint('user_email_key', type_='unique')
        batch_op.create_unique_constraint(None, ['username'])
        batch_op.drop_column('email')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('email', sa.VARCHAR(length=120), autoincrement=False, nullable=False))
        batch_op.drop_constraint(None, type_='unique')
        batch_op.create_unique_constraint('user_email_key', ['email'])
        batch_op.drop_column('username')

    # ### end Alembic commands ###
