FROM node:18-alpine

# Set working directory
WORKDIR /test-project

# Add install_statue.sh script
COPY install_statue.sh /usr/local/bin/install_statue.sh
RUN chmod +x /usr/local/bin/install_statue.sh

# Expose port for preview server
EXPOSE 4173

# CMD: Run the bash script called install_statue.sh
CMD ["/usr/local/bin/install_statue.sh"] 