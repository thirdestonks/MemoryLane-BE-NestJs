import { FileValidator } from '@nestjs/common'
import { fileTypeFromBuffer } from 'file-type'

interface CustomFileTypeValidatorOptions {
  fileType: string[]
}

export class CustomFileTypeValidator extends FileValidator {
  private allowedMimeTypes: string[]

  constructor(protected readonly validationOptions: CustomFileTypeValidatorOptions) {
    super(validationOptions)
    this.allowedMimeTypes = this.validationOptions.fileType
  }

  public async isValid(file?: Express.Multer.File): Promise<boolean> {
    if (!file || !file.buffer) return false

    const fileType = await fileTypeFromBuffer(file.buffer)
    if (!fileType) return false

    return this.allowedMimeTypes.includes(fileType.ext)
  }

  public buildErrorMessage(): string {
    return `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`
  }
}
