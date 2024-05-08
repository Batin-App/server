-- CreateTable
CREATE TABLE "LogEmotion" (
    "id" TEXT NOT NULL,
    "predictedEmotion" TEXT NOT NULL,
    "predictedClass" INTEGER NOT NULL,
    "probabilities" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "LogEmotion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LogEmotion" ADD CONSTRAINT "LogEmotion_date_fkey" FOREIGN KEY ("date") REFERENCES "Log"("date") ON DELETE RESTRICT ON UPDATE CASCADE;
