CREATE TABLE Wallet (
	wallet_id varchar(255) NOT NULL,
	playername varchar(255),
	created TIMESTAMP(6) NOT NULL,
	funds int NOT NULL,
	CONSTRAINT Wallet_pk PRIMARY KEY (wallet_id)
) WITH (
  OIDS=FALSE
);



CREATE TABLE "Transaction" (
	"transaction_id" serial NOT NULL,
	"wallet_id" varchar(255) NOT NULL,
	"amount" int(255) NOT NULL,
	"created" TIMESTAMP(255) NOT NULL,
	"transactiontype_id" int(255) NOT NULL,
	CONSTRAINT "Transaction_pk" PRIMARY KEY ("transaction_id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "TransactionType" (
	"transactiontype_id" serial NOT NULL,
	"typename" varchar(255) NOT NULL,
	CONSTRAINT "TransactionType_pk" PRIMARY KEY ("transactiontype_id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fk0" FOREIGN KEY ("wallet_id") REFERENCES "Wallet"("wallet_id");
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fk1" FOREIGN KEY ("transactiontype_id") REFERENCES "TransactionType"("transactiontype_id");


